import {Link} from 'react-router-dom'

export default function Footer() {
    return (
        <>
        <div className="footer">
            <Link to="/Contact" className='copyright clink'>Contact</Link>
            <p className="copyright">Copyright@ <a href="https://ionutluca.netlify.app/" target='_blank'>Ionut Luca</a></p>
        </div>
        </>
    )
}