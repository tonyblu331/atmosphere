import {
  AnchorHTMLAttributes,
  ComponentType,
  ElementRef,
  forwardRef,
  PropsWithRef,
} from 'react';

import { Link as RadixLink } from '@radix-ui/react-navigation-menu';

type AnchorProps = AnchorHTMLAttributes<HTMLAnchorElement>;

export type NavigationMenuAsLinkProps<CustomProps extends object | undefined> =
  PropsWithRef<AnchorProps> &
    Required<Pick<AnchorProps, 'href'>> & { customLinkProps?: CustomProps };

export interface NavigationMenuLinkProps<
  CustomProps extends object | undefined = undefined,
> extends NavigationMenuAsLinkProps<CustomProps> {
  asLink?: ComponentType<NavigationMenuAsLinkProps<CustomProps>>;
}

export const NavigationMenuLink = forwardRef<
  ElementRef<typeof RadixLink>,
  NavigationMenuLinkProps
>(({ asLink, customLinkProps, ...props }, ref) => {
  const LinkComponent = asLink ?? 'a';
  return (
    <RadixLink ref={ref} asChild={true}>
      <LinkComponent {...(customLinkProps ?? {})} {...props} />
    </RadixLink>
  );
});
NavigationMenuLink.displayName = RadixLink.displayName;
