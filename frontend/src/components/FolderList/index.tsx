import React from "react";
import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  Box,
  Button,
} from "@mui/material";
import { Delete, Download } from "@mui/icons-material";
import { FileDetail } from "../../types/folderTypes";

interface FolderListProps {
  files: FileDetail[];
  deleteButtonHandler: (filename: string) => Promise<void>;
  downloadButtonHandler: (filename: string) => string;
}

const FolderList: React.FC<FolderListProps> = ({
  files,
  deleteButtonHandler,
  downloadButtonHandler,
}) => {
  return (
    <>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-evenly",
          alignItems: "center",
        }}
      >
        <Button
          variant="contained"
          color="success"
          onClick={() => {
            window.location.reload();
          }}
        >
          {"Refresh"}
        </Button>
        <Button variant="contained">{"Download All"}</Button>
      </Box>
      <List sx={{ width: "100%" }}>
        {files.map((file, index) => (
          <ListItem
            key={index}
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid #BBB",
            }}
          >
            <ListItemText
              primary={file.name}
              secondary={`Created on: ${file.creation_date} | Size: ${file.size}`}
            />
            <div>
              <IconButton
                color="error"
                onClick={() => {
                  deleteButtonHandler(file.name);
                }}
              >
                <Delete />
              </IconButton>
              <IconButton href={downloadButtonHandler(file.name)}>
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
