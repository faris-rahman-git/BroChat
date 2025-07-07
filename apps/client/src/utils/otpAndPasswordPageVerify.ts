import { RootState } from "@client/redux/store"
import { useSelector } from "react-redux"

export const otpAndPasswordPageVerify = () =>{
    const email = useSelector((state: RootState) => state.auth.email)
    if(!email) return false
    return true
}