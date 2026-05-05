import { app } from './app';
import { ambiente } from './config/environment';

app.listen(ambiente.PORTA, () => {
  console.log(`Servidor rodando na porta ${ambiente.PORTA}`);
});
