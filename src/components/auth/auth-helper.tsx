// Add this inside the same file, outside RegisterForm
export const PasswordStrengthMeter = ({ password }: { password: string }) => {
  const criteria = [
    { label: "Min 8 characters", valid: password.length >= 8 },
    { label: "Uppercase letter", valid: /[A-Z]/.test(password) },
    { label: "Lowercase letter", valid: /[a-z]/.test(password) },
    { label: "Number", valid: /[0-9]/.test(password) },
  ];

  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        {criteria.map((item, idx) => (
          <div
            key={idx}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              item.valid ? "bg-green-500" : "bg-gray-300 dark:bg-gray-700"
            }`}
          />
        ))}
      </div>
      <div className="text-xs text-muted-foreground">
        Password must have at least 8 characters, one uppercase, one lowercase
        letter, and one number.
      </div>
    </div>
  );
};
