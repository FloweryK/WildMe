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
import { useState } from "react";

const detailsDefault = [
  { name: "n_vocab", value: 20000 + 7 },
  { name: "n_seq", value: 1000 },
  { name: "n_layer", value: 6 },
  { name: "n_head", value: 8 },
  { name: "d_emb", value: 512 },
  { name: "d_hidden", value: 2048 },
  { name: "dropout", value: 0.1 },
  { name: "scale", value: 8.0 },
  { name: "r_split", value: 0.9 },
  { name: "device", value: "cpu" },
  { name: "use_amp", value: true },
  { name: "n_epoch", value: 50 },
  { name: "n_batch", value: 16 },
  { name: "n_accum", value: 1 },
  { name: "lr", value: 1e-5 },
  { name: "warmup_steps", value: 4000 },
  { name: "label_smoothing", value: 0.1 },
];

interface ReserveFormProps {
  open: boolean;
  handleSubmit: any;
  handleClose: any;
}

const ReserveFormDialog = (props: ReserveFormProps) => {
  const { open, handleSubmit, handleClose } = props;
  const [isShowDetails, setShowDetails] = useState<boolean>(false);

  const handleShowDetails = () => {
    setShowDetails(!isShowDetails);
  };

  return (
    <Dialog component="form" open={open} onSubmit={handleSubmit} onClose={handleClose}>
      <DialogTitle>학습 예약하기</DialogTitle>
      <DialogContent>
        <FormControl fullWidth size="small" sx={{ mt: 1, mb: 2 }}>
          <InputLabel>텍스트 추출 경로</InputLabel>
          <Select id="data_type" name="data_type" label="텍스트 추출 경로" defaultValue={"kakaotalk_mobile"}>
            <MenuItem value={"kakaotalk_mobile"}>카카오톡 모바일</MenuItem>
            <MenuItem value={"kakaotalk_pc"}>카카오톡 PC</MenuItem>
          </Select>
        </FormControl>
        <Input id="file" name="file" type="file" inputProps={{ accept: ".txt" }} fullWidth required />
        <TextField
          id="speaker"
          name="speaker"
          label="학습 대상 이름"
          fullWidth
          margin="dense"
          variant="standard"
          required
        />

        <FormControlLabel control={<Switch checked={isShowDetails} onChange={handleShowDetails} />} label="상세 설정" />
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
