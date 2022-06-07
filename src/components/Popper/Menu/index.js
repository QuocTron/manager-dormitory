import Tippy from '@tippyjs/react/headless';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import './menu.scss';
import MenuItem from './MenuItem';

function Menu({ children, items = [] }) {
  const renderItem = () => {
    return items.map((item, index) => <MenuItem key={index} data={item} />);
  };

  return (
    <Tippy
      trigger="click"
      interactive
      placement="bottom-end"
      render={(attrs) => (
        <div className="menu-content" tabIndex={-1} {...attrs}>
          <PopperWrapper>{renderItem()}</PopperWrapper>
        </div>
      )}
    >
      {children}
    </Tippy>
  );
}

export default Menu;
