import LoginSync from "../islands/LoginSync.tsx";

export default function Login() {
  return (
    <div class="app-container">
      <main class="main-content flex items-center justify-center">
        <div class="lesson-card w-full max-w-md text-center">
          <h1 class="page-title mb-2">Welcome Back</h1>
          <p class="text-gray-500 mb-8">
            Enter your Student ID to sync your progress from the cloud.
          </p>

          <LoginSync />

          <div class="mt-8 text-sm text-gray-400">
            <p>Don't have an ID? Your progress will save locally as a Guest.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
