import { Card, CardActionArea, CardContent } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { styled } from "styled-components";

const StyledEmptyCard = styled.div`
  .card {
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .cardContent {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 50px;
    border: "2px dashed #777";
  }
`;

interface EmptyCardProps {
  onClick: any;
}

const EmptyCard = (props: EmptyCardProps) => {
  const { onClick } = props;

  return (
    <StyledEmptyCard>
      <Card variant="outlined" className="card">
        <CardActionArea onClick={onClick}>
          <CardContent className="cardContent">
            <AddIcon />
          </CardContent>
        </CardActionArea>
      </Card>
    </StyledEmptyCard>
  );
};

export default EmptyCard;
