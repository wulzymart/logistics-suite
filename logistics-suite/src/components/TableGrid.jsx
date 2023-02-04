import React, { useState } from "react";

import { DataGrid } from "@mui/x-data-grid";

export default function TableGrid({
  rows,
  columns,
  setSelectedId,

  boxHeight,
  ...otherProps
}) {
  const [pageSize, setPageSize] = useState(5);
  return (
    <div className="h-full w-full">
      <DataGrid
        sx={{
          "&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell": {
            py: "10px",
          },
          "&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell": {
            py: "20px",
          },
          "&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell": {
            py: "30px",
          },
        }}
        rows={rows}
        getRowClassName={(row) => {
          return "bg-blue-300";
        }}
        headerHeight={50}
        getRowHeight={() => "auto"}
        columns={columns}
        rowsPerPageOptions={[5, 10, 20]}
        pageSize={pageSize}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        pagination
        onSelectionModelChange={(checked) => {
          setSelectedId(checked);
        }}
        loading={!rows.length}
        {...otherProps}
      />
    </div>
  );
}
