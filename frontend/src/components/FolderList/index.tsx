import React from 'react';
import { List, ListItem, ListItemText, IconButton } from '@mui/material';
import { Delete, Download } from '@mui/icons-material';

export interface FileDetail {
    name: string;
    creation_date: string;
    size: string;
}

interface FolderListProps {
    files: FileDetail[];
    backendUrl: string;
}

const FolderList: React.FC<FolderListProps> = ({ files, backendUrl }) => {
    const handleDelete = async (file: string) => {
        if (window.confirm(`Are you sure you want to delete the file: ${file}?`)) {
            try {
                const response = await fetch(`${backendUrl}/delete/${file}`, { method: 'GET' });
                if (response.ok) {
                    alert(`File ${file} deleted successfully.`);
                    window.location.reload(); // Reload the page to update the file list
                } else {
                    alert(`Failed to delete file ${file}.`);
                }
            } catch (error) {
                console.error('Error deleting file:', error);
                alert(`Error deleting file ${file}.`);
            }
        }
    };

    return (
        <>
            <List sx={{ width: "100%" }}>
                {files.map((file, index) => (
                    <ListItem key={index} sx={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderBottom: "1px solid #BBB"
                    }}>
                        <ListItemText primary={file.name} secondary={`Created on: ${file.creation_date} | Size: ${file.size}`} />
                        <div>
                            <IconButton color='error' onClick={() => handleDelete(file.name)}>
                                <Delete />
                            </IconButton>
                            <IconButton href={`${backendUrl}/download/${file.name}`}>
                                <Download />
                            </IconButton>
                        </div>
                    </ListItem>
                ))}
            </List>
        </>
    );
};

export default FolderList;
