export default function ContributionField({ field, error, value }) {
  const Tag = field.multiline ? "textarea" : "input";
  return (
    <div className="auth-field">
      <label htmlFor={field.name}>{field.label}{field.required ? " *" : " (ស្រេចចិត្ត / optional)"}</label>
      <p className="field-hint" id={`${field.name}-hint`}>
        {field.array ? "មួយធាតុក្នុងមួយបន្ទាត់; យ៉ាងតិចមួយ។ អតិបរមា 500 តួអក្សរក្នុងមួយធាតុ។ / One item per line; at least one. Maximum 500 characters each."
          : field.required ? `1–${field.max} តួអក្សរ / 1–${field.max} characters.`
            : `អតិបរមា ${field.max} តួអក្សរ / Maximum ${field.max} characters.`}
      </p>
      <Tag id={field.name} name={field.name} required={field.required} rows={field.multiline ? 4 : undefined}
        defaultValue={Array.isArray(value) ? value.join("\n") : value ?? ""}
        aria-invalid={Boolean(error)} aria-describedby={`${field.name}-hint ${field.name}-error`} />
      <span className="auth-error" id={`${field.name}-error`}>{error}</span>
    </div>
  );
}
