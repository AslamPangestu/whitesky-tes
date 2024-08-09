import styles from "./index.module.css";

interface Item {
  key: string;
  label: string;
  onClick?: () => void;
}
interface Props {
  label: string;
  items: Array<Item>;
}

const DropdownButton = ({ label, items }: Props) => {
  return (
    <div className={styles.dropdownContainer}>
      <div className={styles.item}>
        <div className={styles.dropdownButton}>
          <span>{label}</span>
          <svg viewBox="0 0 360 360" xmlSpace="preserve">
            <g id="SVGRepo_iconCarrier">
              <path
                id="XMLID_225_"
                d="M325.607,79.393c-5.857-5.857-15.355-5.858-21.213,0.001l-139.39,139.393L25.607,79.393 c-5.857-5.857-15.355-5.858-21.213,0.001c-5.858,5.858-5.858,15.355,0,21.213l150.004,150c2.813,2.813,6.628,4.393,10.606,4.393 s7.794-1.581,10.606-4.394l149.996-150C331.465,94.749,331.465,85.251,325.607,79.393z"
              ></path>
            </g>
          </svg>
        </div>
        <div className={styles.submenu}>
          {items.map((item) => (
            <div
              key={item.key}
              className={styles.submenuItem}
              {...(item.onClick && { onClick: item.onClick })}
            >
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DropdownButton;
