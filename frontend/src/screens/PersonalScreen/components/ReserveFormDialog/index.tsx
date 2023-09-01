import { useState } from "react";
import {
  Box,
  Button,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Input,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
} from "@mui/material";
import { ReserveFormProps } from "./interface";

const detailsDefault = [
  { name: "n_vocab", value: 20000 + 7 },
  { name: "n_seq", value: 1000 },
  { name: "n_layer", value: 6 },
  { name: "n_head", value: 8 },
  { name: "d_emb", value: 512 },
  { name: "d_hidden", value: 2048 },
  { name: "dropout", value: 0.1 },
  { name: "scale", value: 8.0 },
  { name: "r_split", value: 0.7 },
  { name: "n_epoch", value: 50 },
  { name: "n_batch", value: 32 },
  { name: "n_accum", value: 1 },
  { name: "lr", value: 1e-5 },
  { name: "warmup_steps", value: 4000 },
  { name: "label_smoothing", value: 0.1 },
  { name: "augment_topn", value: 10 },
  { name: "augment_threshold", value: 0.7 },
];

const ReserveFormDialog = (props: ReserveFormProps) => {
  const { open, handleSubmit, handleClose } = props;
  const [isShowDetails, setShowDetails] = useState<boolean>(false);

  const handleShowDetails = () => {
    setShowDetails(!isShowDetails);
  };

  return (
    <Dialog
      component="form"
      open={open}
      onSubmit={handleSubmit}
      onClose={handleClose}
    >
      <DialogTitle>학습 예약하기</DialogTitle>
      <DialogContent>
        <Input
          id="file"
          name="file"
          type="file"
          inputProps={{ accept: ".txt,.csv" }}
          fullWidth
          required
        />
        <TextField
          id="speaker"
          name="speaker"
          label="학습 대상 이름"
          fullWidth
          margin="dense"
          variant="standard"
          required
        />

        <FormControlLabel
          control={
            <Switch checked={isShowDetails} onChange={handleShowDetails} />
          }
          label="상세 설정"
        />
        <Collapse in={isShowDetails}>
          <Box>
            {detailsDefault.map(({ name, value }) => (
              <TextField
                key={name}
                id={name}
                name={name}
                label={name}
                defaultValue={value}
                fullWidth
                margin="dense"
                variant="standard"
                required
              />
            ))}
            <FormControl fullWidth size="small" sx={{ mt: 1, mb: 2 }}>
              <InputLabel>Data Augmentation</InputLabel>
              <Select
                id="is_augment"
                name="is_augment"
                label="Data Augmentation"
                defaultValue={"true"}
              >
                <MenuItem value={"true"}>사용</MenuItem>
                <MenuItem value={"false"}>미사용</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth size="small" sx={{ mt: 1, mb: 2 }}>
              <InputLabel>CUDA 사용</InputLabel>
              <Select
                id="device"
                name="device"
                label="CUDA 사용"
                defaultValue={"cuda"}
              >
                <MenuItem value={"cuda"}>사용</MenuItem>
                <MenuItem value={"cpu"}>미사용</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth size="small" sx={{ mt: 1, mb: 2 }}>
              <InputLabel>AMP 사용</InputLabel>
              <Select
                id="is_amp"
                name="is_amp"
                label="AMP 사용"
                defaultValue={"true"}
              >
                <MenuItem value={"true"}>사용</MenuItem>
                <MenuItem value={"false"}>미사용</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Collapse>
      </DialogContent>
      <DialogActions>
        <Button type="submit">등록</Button>
        <Button onClick={handleClose}>취소</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReserveFormDialog;
