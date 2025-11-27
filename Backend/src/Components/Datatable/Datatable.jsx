import { MaterialReactTable } from 'material-react-table';
import { Button } from '@mui/material';
import { mkConfig, generateCsv, download } from 'export-to-csv';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import './MUI.css';

export default function Datatable({ columns, data, onEdit, onView, onDelete, permissions }) {

    const excludedFields = ['_id', 'secret_code', 'password', '__v', 'images', 'createdOn'];

    const userType = localStorage.getItem("userType");


    const handleExportCsv = () => {
        const filteredData = data.map(row => {
            const filteredRow = { ...row };
            excludedFields.forEach(field => delete filteredRow[field]);

            for (const key in filteredRow) {
                const item = filteredRow[key];
                if (item?.name) {
                    filteredRow[key] = item.name;
                }
            }

            return filteredRow;
        });

        const csvConfig = mkConfig({
            fieldSeparator: ',',
            decimalSeparator: '.',
            useKeysAsHeaders: true,
        });

        const csv = generateCsv(csvConfig)(filteredData);
        download(csvConfig)(csv);
    };


    const dynamicColumns = [
        {
            id: 'serial',
            header: 'SL',
            size: 50,
            Cell: ({ row }) => {
                return data.length - row.index;
            },
        },


        ...columns,
        {
            id: 'actions',
            header: 'Actions',
            maxSize: 130,
            Cell: ({ row }) => (
                <div className="space-x-2">
                    {permissions.canView && (
                        <button className="actionBtn cursor-pointer px-[8px] py-[2px] rounded hover:shadow-2xl bg-slate-100 [&>svg]:w-[15px] hover:bg-slate-300" onClick={() => onView(row.original)} >
                            <VisibilityIcon />
                        </button>
                    )}

                    {permissions.canEdit && (
                        <button className="actionBtn cursor-pointer px-[8px] py-[2px] rounded hover:shadow-2xl bg-orange-50 [&>svg]:w-[15px] hover:bg-orange-300" onClick={() => onEdit(row.original)}  >
                            <EditIcon />
                        </button>
                    )}

                    {permissions.canDelete && (
                        <button className="actionBtn cursor-pointer px-[8px] py-[2px] rounded hover:shadow-2xl text-red-400 bg-red-50 [&>svg]:w-[15px] hover:bg-red-300" onClick={() => onDelete(row.original)} >
                            <DeleteIcon />
                        </button>
                    )}
                </div>
            ),
        },
    ];

    return (
        <MaterialReactTable
            data={data}
            columns={dynamicColumns}
            enableFullScreenToggle={false}
            enableDensityToggle={false}
            initialState={{
                density: 'compact',
                pagination: { pageSize: 20, pageIndex: 0 },
            }}
            muiPaginationProps={{ rowsPerPageOptions: [20, 50, 100] }}
            enableColumnActions={false}
            enableCellActions={true}
            renderTopToolbarCustomActions={() =>
                userType !== "Agent" && (
                    <section>
                        <Button className="!text-black !capitalize" onClick={handleExportCsv} startIcon={<DownloadIcon />}>
                            Export
                        </Button>
                    </section>
                )
            }

        />
    );
}

