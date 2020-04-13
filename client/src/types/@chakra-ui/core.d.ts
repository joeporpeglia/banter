export * from "@chakra-ui/core";

declare module "@chakra-ui/core" {
  import React from "react";
  import { LinkProps, ButtonProps } from "@chakra-ui/core";

  type AsPatch = {
    as?: any;
    to?: string;
  };
  export const BreadcrumbLink: React.ComponentType<
    Omit<LinkProps, "as"> & AsPatch
  >;
  export const Button: React.ComponentType<Omit<ButtonProps, "as"> & AsPatch>;
}
