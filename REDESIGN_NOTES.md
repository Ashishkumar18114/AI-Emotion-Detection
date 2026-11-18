# EMOTIQ UI/UX redesign

The frontend has been redesigned into a dark AI-studio experience. The Flask backend and its `/detect` API remain unchanged.

## What's new
- Responsive dark landing page, detection studio, process cards and footer.
- Separate camera/upload modes. Switching modes stops the camera and clears stale images/results.
- Photo capture stops the camera after capturing a frame.
- Image validation (image MIME type, 10 MB size) and backend error display.
- Prediction result and confidence meter, with a note on interpreting the score.
- Camera stream cleanup on unmount and cancellation guards for outdated requests.

## Run
1. `cd frontend/web`
2. `npm install`
3. Copy `.env.example` to `.env` and set `VITE_API_BASE_URL` to your backend URL.
4. `npm run dev`
5. Start Flask separately, following the root README.

**Important:** `backend/emotion_vit_model.pt` is a Git LFS pointer in the original ZIP, not the model weights. Retrieve the model through Git LFS or your original model storage before running detection.

The Android APK has not been modified. The website processes individual uploaded/captured images, not a continuously analyzed video stream.
