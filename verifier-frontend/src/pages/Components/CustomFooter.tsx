import {
  Footer,
  FooterCopyright,
  FooterLinkGroup,
  FooterLink,
} from 'flowbite-react';

export function CustomFooter() {
  return (
    <Footer container>
      <FooterCopyright href='#' by='Yongwoo Hur' year={2025} />
      <FooterLinkGroup>
        <FooterLink href='#'>About</FooterLink>
        <FooterLink href='#'>Privacy Policy</FooterLink>
        <FooterLink href='#'>Licensing</FooterLink>
        <FooterLink href='#'>Contact</FooterLink>
      </FooterLinkGroup>
    </Footer>
  );
}
