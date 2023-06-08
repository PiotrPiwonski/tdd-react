const Alert = (props) => {
    let classForAlert = `alert alert-${props.type} mt-3`;
    if(props.center) {
        classForAlert += " text-center";
    }
    return (
        <div className={classForAlert}>
            {props.children}
        </div>
    )
};

Alert.defaultProps = {
    type: 'success',
}

export default Alert;