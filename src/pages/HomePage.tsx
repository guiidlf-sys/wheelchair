import { useNavigate } from 'react-router-dom';
import HomeScreen from '../components/HomeScreen';

export default function HomePage() {
  const navigate = useNavigate();
  return <HomeScreen onStart={() => navigate('/personnalisation')} onBrowse={() => navigate('/catalogue')} />;
}
