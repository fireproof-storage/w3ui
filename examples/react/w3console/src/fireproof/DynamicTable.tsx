

export default function DynamicTable() {
  return (
    <div class="relative overflow-x-auto dark">
        <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead class="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" class="px-6 py-3">
                _id
                <sub class="text-gray-400 dark:text-gray-500">({idCount})</sub>
              </th>
              {sortedHeaders.map(([header, count]) => (
                <th scope="col" class="px-6 py-3">
                  {header}
                  <sub class="text-gray-400 dark:text-gray-500">({count})</sub>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allDocuments.map(({ _id, ...fields }: any) => (
              <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  <a href={`/fp-doc?id=${_id}`}>{_id}</a>
                </th>
                {sortedHeaders.map(([header]) => (
                  <td class="px-6 py-4">{formatTableCellContent(fields[header])}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  )
}