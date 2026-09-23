# Deployment rules

Use `deploy/push-to-vps.sh` for production updates.

1. Build images locally. Never build on the VPS.
2. Build `linux/amd64`; the VPS does not run the local Mac architecture.
3. Use immutable image tags. Set `FE_IMAGE_TAG` and `BE_IMAGE_TAG` for each release.
4. Upload the image archive to the VPS and update the Swarm service.
5. Wait for both Swarm services to converge before cleanup.
6. Verify the site, API health, Novel API, and at least one Novel image through `/_next/image`.
7. Remove only old images that are no longer used by active services.
8. Remove local release images only after production verification passes.
9. Push the verified commit to GitHub last.
10. Keep `deploy/vps.env` local and never commit credentials.

The script must stop on build, upload, update, or verification failure. Cleanup must
not run after a failed deployment.
