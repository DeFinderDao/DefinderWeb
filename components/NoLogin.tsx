import { useDispatch } from 'react-redux'
import { showWalletDialog } from 'redux/actions/UserInfoAction'

interface NoLoginProps {
    desc: string,
    btnText: string
}

export default function noLogin({ desc, btnText } : NoLoginProps) {
    const dispatch = useDispatch();
    const goLogin = () => {
        dispatch(showWalletDialog());
    }
    return (
        <div className="no-login">
            <span>{desc}</span>
            <a onClick={goLogin}>{btnText}</a>
        </div>
    )
}
