import FileUploader from "./FileUploader.tsx";

const TransactionsPage = () => {
  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h2 className="text-2xl font-bold">Транзакції</h2>
      <p className="mt-2">Тут будуть Транзакції.</p>

      <FileUploader />
    </div>
  );
};
export default TransactionsPage;
