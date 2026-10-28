const Notification = ({ message }) => {
    if (message === null) {
        return null;
    }

    return (
        <div className={`${message.includes('successfully') ? 'success' : 'error'}`}>
            {message}
        </div>
    )
}

export default Notification