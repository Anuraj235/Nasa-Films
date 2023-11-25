import { UserGetDto } from "../../constants/types";
import { PrimaryNavigation } from "../navigation/navigation";
import { Container } from "@mantine/core";
import { createStyles, Divider } from "@mantine/core";
import Image from "../../assets/body-bg.png";
import TransparentImage from "../../assets/shows-bg.png";

type PageWrapperProps = {
  user?: UserGetDto;
  children?: React.ReactNode;
};
const wrapperStyle: React.CSSProperties = {
  position: "relative",
  minHeight: "100vh",
};

const backgroundImageStyle: React.CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundImage: `url(${Image})`,
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
};

const overlayImageStyle: React.CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundImage: `url(${TransparentImage})`,
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  opacity: 0.7,
};
//This is the wrapper that surrounds every page in the app.  Changes made here will be reflect all over.
export const PageWrapper: React.FC<PageWrapperProps> = ({ user, children }) => {
  const { classes } = useStyles();
  return (
    <div className="content" style={wrapperStyle}>
      <div style={backgroundImageStyle}></div>
      <div style={overlayImageStyle}></div>
      <PrimaryNavigation user={user} />
      <Divider
        my="sm"
        style={{ position: "relative", zIndex: 1, color: "black" }}
        variant="dashed"
      />
      <Container
        px={0}
        fluid
        className={classes.mainContent}
        style={{ color: "#afffff" }}
      >
        {children}
      </Container>
    </div>
  );
};

const useStyles = createStyles(() => {
  return {
    mainContent: {
      marginTop: "10px",
      position: "relative",
      zIndex: 1,
    },
  };
});
