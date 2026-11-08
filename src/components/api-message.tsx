import { ApiErrorToast } from "@/components/api-error-toast";

export function ApiMessage({ message }: { message: string }) {
  return (
    <div className="api-message" role="alert">
      <ApiErrorToast message={message} />
      <strong>দুঃখিত, তথ্য দেখানো যাচ্ছে না</strong>
      <span>{message}</span>
    </div>
  );
}
