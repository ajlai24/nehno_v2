import { useTranslations } from "next-intl";

export default function NotFoundPage() {
  const t = useTranslations("NotFoundPage");

  return (
    <div className="flex justify-center flex-col items-center mt-4">
      <h1 className="text-center text-3xl lg:text-4xl font-bold">
        {t("title")}
      </h1>
      <p className="text-center mt-4 max-w-[460px]">{t("description")}</p>
    </div>
  );
}
