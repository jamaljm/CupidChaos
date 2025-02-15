import Image from "next/image";
import styles from "./Cover.module.css";

const Cover = ({
  title,
  coverImage,
}: {
  title: string;
  coverImage: string;
}) => {
  return (
    <div className={styles.coverContainer}>
      <div className={styles.coverWrapper}>
        <Image
          src={coverImage}
          alt="Story cover"
          fill
          className={styles.coverImage}
          priority
        />
        <h1 className={styles.title}>{title}</h1>
      </div>
    </div>
  );
};

export default Cover;
