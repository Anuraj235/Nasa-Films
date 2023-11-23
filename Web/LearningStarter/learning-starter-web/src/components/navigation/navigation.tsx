import React, { useEffect, useState } from "react";
import { routes } from "../../routes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
  Header,
  Menu,
  Image,
  createStyles,
  Container,
  Group,
  useMantineColorScheme,
  Button,
  Flex,
  Text,
  Avatar,
} from "@mantine/core";
import {
  NAVBAR_HEIGHT,
  NAVBAR_HEIGHT_NUMBER,
} from "../../constants/theme-constants";
import {
  NavLink,
  NavLinkProps,
  useLocation,
  useNavigate,
} from "react-router-dom";
import logo from "../../assets/logo.png";
import { UserGetDto } from "../../constants/types";
import { useAuth } from "../../authentication/use-auth";

type PrimaryNavigationProps = {
  user?: UserGetDto;
};

type NavigationItem = {
  text: string;
  icon?: IconProp | undefined;
  hide?: boolean;
} & (
  | {
      nav: Omit<
        NavLinkProps,
        keyof React.AnchorHTMLAttributes<HTMLAnchorElement>
      >;
      children?: never;
    }
  | { nav?: never; children: NavigationItemForceNav[] }
);

export type NavigationItemForceNav = {
  text: string;
  icon?: IconProp | undefined;
  hide?: boolean;
  nav: NavLinkProps;
};

const navigation: NavigationItem[] = [
  {
    text: "Home",
    hide: false,
    nav: {
      to: routes.home,
    },
  },
  {
    text: "Movies",
    hide: false,
    nav: {
      to: routes.movies,
    },
  },

  {
    text: "About Us",
    hide: false,
    nav: {
      to: routes.aboutus,
    },
  },
];

const DesktopNavigation = () => {
  const { classes, cx } = useStyles();
  const { pathname } = useLocation();
  const [active, setActive] = useState(navigation[0].nav?.to.toString());

  useEffect(() => {
    setActive(pathname);
  }, [pathname, setActive]);

  return (
    <>
      <Container px={0} className={classes.desktopNav}>
        <Flex direction="row" align="center" className={classes.fullHeight}>
          {navigation
            .filter((x) => !x.hide)
            .map((x, i) => {
              if (x.children) {
                return (
                  <Menu trigger="hover" key={i}>
                    <Menu.Target>
                      <Button
                        size="md"
                        className={classes.paddedMenuItem}
                        variant="subtle"
                        key={i}
                      >
                        {x.icon && <FontAwesomeIcon icon={x.icon} />} {x.text}
                      </Button>
                    </Menu.Target>
                    <Menu.Dropdown>
                      {x.children
                        .filter((x) => !x.hide)
                        .map((y) => {
                          return (
                            <Menu.Item
                              key={`${y.text}`}
                              to={y.nav.to}
                              component={NavLink}
                            >
                              <Flex direction="row">
                                <Text size="sm">
                                  {y.icon && <FontAwesomeIcon icon={y.icon} />}{" "}
                                  {y.text}
                                </Text>
                              </Flex>
                            </Menu.Item>
                          );
                        })}
                    </Menu.Dropdown>
                  </Menu>
                );
              }
              return (
                <Button
                  size="md"
                  component={NavLink}
                  to={x.nav.to}
                  color="cyan"
                  className={cx(classes.paddedMenuItem, {
                    [classes.linkActive]: active === x.nav.to,
                  })}
                  variant="subtle"
                  key={i}
                >
                  {x.icon && <FontAwesomeIcon icon={x.icon} />} {x.text}
                </Button>
              );
            })}
        </Flex>
      </Container>
    </>
  );
};

export const PrimaryNavigation: React.FC<PrimaryNavigationProps> = ({
  user,
}) => {
  const { classes } = useStyles();
  const { logout } = useAuth();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const navigate = useNavigate();
  const dark = colorScheme === "dark";
  return (
    <Header height={NAVBAR_HEIGHT_NUMBER}>
      <Container px={20} fluid>
        <Flex direction="row" justify="space-between" align="center">
          <Group>
            <Flex direction="row" align="center">
              <NavLink to={routes.root}>
                <Image
                  className={classes.logo}
                  width={60}
                  height={50}
                  radius="sm"
                  withPlaceholder
                  src={logo}
                  alt="logo"
                />
              </NavLink>
              {user && <DesktopNavigation />}
              { user && (<Menu>
                <Menu.Target>
                <Button
                  size="md"
                  className={classes.paddedMenuItem}
                  variant="subtle"
                >
                  Admin Options
                </Button>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item onClick={() => navigate(routes.addMovie)}>Add movie</Menu.Item>
                  <Menu.Item onClick={() => navigate(routes.theaterListing)}>View theatres </Menu.Item>
                  <Menu.Item onClick={() => navigate(routes.theater)}>Add theatre</Menu.Item>
                  <Menu.Item onClick={() => navigate(routes.showtimecreate)}>Add showtimes</Menu.Item>
                </Menu.Dropdown>
              </Menu>)}
            </Flex>
          </Group>
          <Group>
            {user && (
              <Menu>
                <Menu.Target>
                  <Avatar className={classes.pointer}>
                    {user.firstName.substring(0, 1)}
                    {user.lastName.substring(0, 1)}
                  </Avatar>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item onClick={() => navigate(routes.user)}>
                    Profile
                  </Menu.Item>
                  <Menu.Item onClick={() => toggleColorScheme()}>
                    {dark ? "Light mode" : "Dark mode"}
                  </Menu.Item>
                  <Menu.Item onClick={() => logout()}>Sign Out</Menu.Item>
                </Menu.Dropdown>
              </Menu>
            )}
          </Group>
        </Flex>
      </Container>
    </Header>
  );
};

const useStyles = createStyles((theme) => {
  return {
    pointer: {
      cursor: "pointer",
    },
    logo: {
      cursor: "pointer",
      marginRight: "5px",
      paddingTop: "5px",
      height: NAVBAR_HEIGHT,
    },
    paddedMenuItem: {
      margin: "0px 5px 0px 5px",
    },
    linkActive: {
      color: "#afffff",
      backgroundColor: "black",
      borderColor: "#8fb3b3",
      "&:hover": {
        backgroundColor: "black",
      },
    },
    desktopNav: {
      height: NAVBAR_HEIGHT,
      color: "#afffff",
    },
    fullHeight: {
      height: "100%",
    },
  };
});
