import { Button } from "antd";
import styles from './Settings.module.css'
import { useNavigate } from 'react-router-dom';


const Settings: React.FC = () => {
    const navigate = useNavigate();
    return(
        <div className={styles.warningContainer}>
          <h1>Раздел в разработке</h1>
          <Button
            type="primary" 
            style={{ marginBottom: 16 }}
            onClick={() => navigate('/main')}
          >
            На главную
          </Button>
        </div>  
     );
}

export default Settings;