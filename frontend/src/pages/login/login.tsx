import {ContentLogin} from "./content-login"
import { LogoLogin } from "./logo-login";
import "../../App.css"

export const LogIn = () => {
    return (
        <div className="login">
            <LogoLogin />
            <ContentLogin />
        </div>
    );
}