export function TokenLogo(props: any) {
    return <img {...props} className={typeof props.className === 'undefined' ? 'token-logo' : `token-logo ${props.className}`} />
}