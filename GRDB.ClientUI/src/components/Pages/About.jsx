import logo from '../../assets/png/logo-no-background.png'

export default function About () {
    return(
        <>
        <div className="about-container">
            <img src={logo} alt='great reads logo' className='about-logo'/>
            <div className='about-info'>
                <h2>About</h2>
                <p>Great Reads Database is something like IMDB but for books!</p>
            </div>
        </div>
        </>
    )
}