#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<EOF
Usage: $0 [--project PROJECT] [--region REGION] [--service SERVICE] [--repo REPO] [--image IMAGE] [--sheet SHEET_ID] [--sa-key PATH]

Environment variables (used as defaults):
  PROJECT, REGION, SERVICE_NAME, REPO, IMAGE_NAME, NEXT_PUBLIC_GOOGLE_SHEETS_ID

Examples:
  PROJECT=my-project ./scripts/deploy_gcp.sh --region=us-central1 --sa-key=./sa.json
EOF
  exit 1
}

# defaults
PROJECT=${PROJECT:-$(gcloud config get-value project 2>/dev/null || echo "")}
REGION=${REGION:-us-central1}
SERVICE_NAME=${SERVICE_NAME:-wedding-app-524643745004}
REPO=${REPO:-wedding-app-repo}
IMAGE_NAME=${IMAGE_NAME:-wedding-app}
SHEET_ID=${SHEET_ID:-${NEXT_PUBLIC_GOOGLE_SHEETS_ID:-""}}
SA_KEY_FILE=""
SECRET_NAME=${SECRET_NAME:-gcp-service-account-key}

for arg in "${@}"; do
  case $arg in
    --project=*) PROJECT="${arg#*=}" ;;
    --region=*) REGION="${arg#*=}" ;;
    --service=*) SERVICE_NAME="${arg#*=}" ;;
    --repo=*) REPO="${arg#*=}" ;;
    --image=*) IMAGE_NAME="${arg#*=}" ;;
    --sheet=*) SHEET_ID="${arg#*=}" ;;
    --sa-key=*) SA_KEY_FILE="${arg#*=}" ;;
    -h|--help) usage ;;
    *) echo "Unknown arg: $arg"; usage ;;
  esac
done

if [ -z "$PROJECT" ]; then
  echo "ERROR: GCP project not set. Provide with --project or set gcloud config." && exit 2
fi

echo "Project: $PROJECT"
echo "Region: $REGION"
echo "Service: $SERVICE_NAME"
echo "Repo: $REPO"
echo "Image: $IMAGE_NAME"

echo "Enabling required APIs..."
gcloud services enable cloudbuild.googleapis.com run.googleapis.com artifactregistry.googleapis.com secretmanager.googleapis.com --project="$PROJECT"

echo "Ensuring Artifact Registry repository exists..."
if gcloud artifacts repositories describe "$REPO" --location="$REGION" --project="$PROJECT" >/dev/null 2>&1; then
  echo "Artifact repo $REPO exists in $REGION"
else
  echo "Creating artifact repo $REPO in $REGION"
  gcloud artifacts repositories create "$REPO" \
    --repository-format=docker --location="$REGION" --description="Docker repo for wedding app" --project="$PROJECT"
fi

IMAGE_URI="${REGION}-docker.pkg.dev/${PROJECT}/${REPO}/${IMAGE_NAME}:latest"

echo "Building and pushing image to Artifact Registry: $IMAGE_URI"
gcloud builds submit --tag "$IMAGE_URI" --project="$PROJECT"

if [ -n "$SA_KEY_FILE" ]; then
  if [ ! -f "$SA_KEY_FILE" ]; then
    echo "Service account key file not found: $SA_KEY_FILE" && exit 3
  fi
  echo "Uploading service account key to Secret Manager as secret '$SECRET_NAME'..."
  if gcloud secrets describe "$SECRET_NAME" --project="$PROJECT" >/dev/null 2>&1; then
    echo "Adding new secret version"
  else
    echo "Creating secret $SECRET_NAME"
    gcloud secrets create "$SECRET_NAME" --replication-policy="automatic" --project="$PROJECT"
  fi
  gcloud secrets versions add "$SECRET_NAME" --data-file="$SA_KEY_FILE" --project="$PROJECT"
  SECRET_SPEC="$SECRET_NAME:latest"
else
  SECRET_SPEC=""
fi

echo "Deploying to Cloud Run service $SERVICE_NAME..."
DEPLOY_CMD=( gcloud run deploy "$SERVICE_NAME" --image "$IMAGE_URI" --platform managed --region "$REGION" --project "$PROJECT" --allow-unauthenticated )
if [ -n "$SHEET_ID" ]; then
  DEPLOY_CMD+=( --set-env-vars "NEXT_PUBLIC_GOOGLE_SHEETS_ID=$SHEET_ID" )
fi
if [ -n "$SECRET_SPEC" ]; then
  DEPLOY_CMD+=( --set-secrets "GCP_PRIVATE_KEY=$SECRET_SPEC" )
fi

echo "> ${DEPLOY_CMD[*]}"
"${DEPLOY_CMD[@]}"

echo "Deployment finished. Service URL:"
gcloud run services describe "$SERVICE_NAME" --platform managed --region "$REGION" --project="$PROJECT" --format='value(status.url)'

echo "Done."
