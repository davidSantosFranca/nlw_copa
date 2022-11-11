import { SvgProps } from 'react-native-svg';
import LogoSvg from '../assets/logo.svg'
interface LogoProps extends SvgProps{
  
}
function Logo({...rest}:LogoProps) {
  return ( <>
    <LogoSvg {...rest}/>
  </> );
}

export default Logo;