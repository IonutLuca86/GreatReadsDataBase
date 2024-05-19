import logo from '../../assets/png/logo-no-background.png'


export default function Contact () {
    return(
        <>
        <div className="about-container">
            <img src={logo} alt='great reads logo' className='about-logo'/>
            <div className='about-info'>
                <h2>Contact</h2>
                <p>Great Reads Database apreaciates your input!</p>
                <p>Please send a mail to <a href="mailto:ic.luca@outlook.com">contact</a> and we will get back to you soon!</p>
            </div>
        </div>
        </>
    )
}