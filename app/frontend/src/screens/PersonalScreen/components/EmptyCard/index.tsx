import { styled } from "styled-components";
import { Box, Card, CardActionArea, CardContent } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { EmptyCardProps } from "./interface";

const StyledEmptyCard = styled.div`
  .cardContent {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 50px;
    border: "2px dashed #777";
  }
`;

const EmptyCard = (props: EmptyCardProps) => {
  const { onClick } = props;

  return (
    <Box {...props}>
      <StyledEmptyCard>
        <Card variant="outlined" className="card">
          <CardActionArea onClick={onClick}>
            <CardContent className="cardContent">
              <AddIcon color="primary" />
            </CardContent>
          </CardActionArea>
        </Card>
      </StyledEmptyCard>
    </Box>
  );
};

export default EmptyCard;
