export default function ErrorMessage({ message }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
      <p className="text-red-600 text-sm">{message || 'Something went wrong. Please try again.'}</p>
    </div>
  );
}
