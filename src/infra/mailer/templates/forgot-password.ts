type ForgotPasswordProps = {
  url: string;
  name: string;
};

export const forgotPasswordTemplate = ({ url, name }: ForgotPasswordProps) => {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Redefinir Senha</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f2f2f2;
      margin: 0;
      padding: 0;
    }
    .email-container {
      max-width: 600px;
      margin: 30px auto;
      background-color: #ffffff;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    .header {
      background-color: #1f1f1f;
      color: #fff;
      text-align: center;
      padding: 30px 20px;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 600;
    }
    .content {
      padding: 30px 20px;
      text-align: center;
      color: #333;
    }
    .content img.lock-icon {
      width: 60px;
      margin-bottom: 20px;
    }
    .content p {
      font-size: 16px;
      line-height: 1.6;
    }
    .cta-button {
      display: inline-block;
      margin-top: 25px;
      padding: 12px 25px;
      background-color: #333333;
      color: #ffffff;
      text-decoration: none;
      border-radius: 6px;
      font-weight: bold;
      transition: background-color 0.3s ease;
    }
    .cta-button:hover {
      background-color: #000000;
    }
    .footer {
      background-color: #fafafa;
      text-align: center;
      padding: 20px;
      font-size: 14px;
      color: #666;
    }
    .social-links {
      margin: 15px 0;
    }
    .social-links a {
      margin: 0 8px;
      text-decoration: none;
      color: #333;
      font-size: 18px;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>Workout Tracker</h1>
    </div>
    <div class="content">
      <img src="https://img.icons8.com/ios-filled/100/lock--v1.png" alt="Ícone de cadeado" class="lock-icon" />
      <p>Olá, <strong>${name}</strong> 💪</p>
      <p>Recebemos seu pedido para redefinir a senha da sua conta no <strong>Workout Tracker</strong>.</p>
      <p>Para manter sua rotina em dia e continuar evoluindo nos treinos, clique no botão abaixo:</p>
      <a href="${url}" class="cta-button">Redefinir Minha Senha</a>
      <p>Se você não solicitou isso, pode ignorar este e-mail. Sua conta continua segura.</p>
    </div>
    <div class="footer">
      <div class="social-links">
        <a href="https://facebook.com" title="Facebook">📘</a>
        <a href="https://instagram.com" title="Instagram">📸</a>
        <a href="https://twitter.com" title="Twitter">🐦</a>
      </div>
      <p>Workout Tracker &copy; 2025. Todos os direitos reservados.</p>
    </div>
  </div>
</body>
</html>`;
};
