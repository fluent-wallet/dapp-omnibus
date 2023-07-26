import { forwardRef, useMemo, type ComponentProps } from 'react';
import { generateAvatarURL } from '@cfx-kit/dapp-utils/src/account-avatar';

const Avatar = forwardRef<HTMLDivElement, ComponentProps<'div'> & { account: string; size: number }>(({ account, size, ...props }, ref) => {
  const avatarURL = useMemo(() => (account ? generateAvatarURL(account) : undefined), [account]);

  return (
    <div className="avatar" {...props} style={{ width: size, height: size, minWidth: size, ...props.style }} ref={ref}>
      {!!account && (
        <div className="w-full h-full rounded-[50px] overflow-hidden">
          <img className="pointer-events-none select-none" src={avatarURL} alt="account avatar" />
        </div>
      )}
    </div>
  );
});

export default Avatar;
