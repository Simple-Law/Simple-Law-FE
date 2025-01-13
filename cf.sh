ENV="${1:-dev}"

if [[ "$ENV" == "dev" ]]; then
  S3_BUCKET="cf-simplelaw-dev-dev"
  CLOUDFRONT_DISTRIBUTION_ID="E130VO5HR9TD5U"
elif [[ "$ENV" == "prod" ]]; then
  S3_BUCKET="cf-simplelaw-prod-prod"
  CLOUDFRONT_DISTRIBUTION_ID="E254ASKC8T63SR"
fi

echo "building react app..."
yarn build

echo "uploading s3..."
aws s3 sync build/ "s3://$S3_BUCKET" \
  --delete \
  --cache-control 'public,max-age=31536000'

echo "invalidate cf..."
aws cloudfront create-invalidation \
  --distribution-id "$CLOUDFRONT_DISTRIBUTION_ID" \
  --paths "/*"