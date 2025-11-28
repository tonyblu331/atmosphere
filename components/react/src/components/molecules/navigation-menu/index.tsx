import { ComponentProps, ComponentType } from 'react';

import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuListItem,
  NavigationMenuRoot,
  NavigationMenuTrigger,
} from '@components/atoms/navigation-menu';
import { NavigationMenuAsLinkProps } from '@components/atoms/navigation-menu/NavigationMenuLink';
import { navigationMenuTriggerStyle } from '@components/atoms/navigation-menu/navigationMenuTriggerStyle';

interface NavigationMenuBaseSectionProps<
  CustomProps extends object | undefined,
> {
  title: string;
  asLink?: ComponentType<NavigationMenuAsLinkProps<CustomProps>>;
  customLinkProps?: CustomProps;
}

interface NavigationMenuSimpleLinkSectionProps<
  CustomProps extends object | undefined,
> extends NavigationMenuBaseSectionProps<CustomProps> {
  href: string;
}

interface NavigationMenuExtendedLinkProps<
  CustomProps extends object | undefined,
> extends NavigationMenuSimpleLinkSectionProps<CustomProps> {
  description: string;
}

interface NavigationMenuMultipleLinksSectionProps<
  CustomProps extends object | undefined,
> extends NavigationMenuBaseSectionProps<CustomProps> {
  links: NavigationMenuExtendedLinkProps<CustomProps>[];
}

export type NavigationMenuSectionProps<CustomProps extends object | undefined> =

    | NavigationMenuSimpleLinkSectionProps<CustomProps>
    | NavigationMenuMultipleLinksSectionProps<CustomProps>;

export interface NavigationMenuProps<CustomProps extends object | undefined>
  extends Omit<ComponentProps<typeof NavigationMenuRoot>, 'children'> {
  sections: NavigationMenuSectionProps<CustomProps>[];
  asLink?: ComponentType<NavigationMenuAsLinkProps<CustomProps>>;
  customLinkProps?: CustomProps;
}

const instanceOfMultipleLinksSections = <
  CustomProps extends object | undefined,
>(
  object: NavigationMenuSectionProps<CustomProps>,
): object is NavigationMenuMultipleLinksSectionProps<CustomProps> => {
  return 'links' in object;
};

export const NavigationMenu = <
  CustomProps extends object | undefined = undefined,
>({
  sections,
  asLink,
  customLinkProps,
  ...props
}: NavigationMenuProps<CustomProps>) => {
  const LinkComponent =
    asLink ??
    ('a' as unknown as ComponentType<NavigationMenuAsLinkProps<CustomProps>>);
  return (
    <NavigationMenuRoot {...props}>
      <NavigationMenuList>
        {sections.map((section) => (
          <NavigationMenuItem key={section.title}>
            {instanceOfMultipleLinksSections(section) ? (
              <>
                <NavigationMenuTrigger>{section.title}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid list-none gap-3 bg-fuselage-100/20 p-4 backdrop-blur dark:bg-accent/20 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                    {section.links.map((link) => (
                      <NavigationMenuListItem
                        {...customLinkProps}
                        {...section.customLinkProps}
                        {...link.customLinkProps}
                        key={link.title}
                        title={link.title}
                        href={link.href}
                        /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
                        // @ts-expect-error
                        asLink={link.asLink ?? section.asLink ?? LinkComponent}
                      >
                        {link.description}
                      </NavigationMenuListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </>
            ) : (
              <NavigationMenuLink
                {...customLinkProps}
                {...section.customLinkProps}
                className={navigationMenuTriggerStyle()}
                /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
                // @ts-expect-error
                asLink={section.asLink ?? LinkComponent}
                href={section.href}
              >
                {section.title}
              </NavigationMenuLink>
            )}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenuRoot>
  );
};
