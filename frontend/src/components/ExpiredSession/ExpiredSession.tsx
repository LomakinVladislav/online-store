import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import styles from './ExpiredSession.module.css'

const ExpiredSession: React.FC = () => {
    const navigate = useNavigate();
    return(
    <div className={styles.container}>
    <h1>Войдите, чтобы продолжить</h1>
    <Button type="primary" onClick={() => {navigate('/auth')}} style={{ marginBottom: 16 }}>
        Войти
    </Button>
    </div>
)};

export default ExpiredSession;