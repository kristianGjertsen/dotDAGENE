import { DotdageneHeader } from '../components/TestPage/DotdageneHeader';
import LogoNoText from '../assets/Logo_No_Text.svg';

export const TestPage = () => {
  return (
    <DotdageneHeader
      logoSrc={LogoNoText}
      logoAlt="dotDAGENE"
    />
  );
};
