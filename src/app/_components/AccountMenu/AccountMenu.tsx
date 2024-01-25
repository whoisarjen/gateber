'use client'

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Logout from '@mui/icons-material/Logout';
import { useSession } from "next-auth/react";
import { useState, type MouseEvent } from 'react';
import { useRouter } from 'next/navigation';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Badge from '@mui/material/Badge';

export const AccountMenu = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const router = useRouter()
  const session = useSession()
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    if (session.status === 'authenticated') {
      setAnchorEl(event.currentTarget);
    } else {
      router.push('/api/auth/signin')
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onAuthorPosts = () => {
    handleClose()
    router.push(`/authors/${session.data?.user.id}`)
  }

  const onSignOut = () => {
    handleClose()
    router.push('/api/auth/signout')
  }

  const handleOnNotification = () => {
    router.push('/notifications')
  }

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <Typography
          sx={{ minWidth: 100 }}
          onClick={() => router.push('/dashboard/create')}
        >
          Dodaj wpis
        </Typography>
        <IconButton
          size="small"
          sx={{ ml: 2 }}
        >
          <Badge badgeContent={0} color="primary" onClick={handleOnNotification}>
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ ml: 2 }}
          aria-controls={open ? 'account-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <Avatar
            sx={{
              width: 32,
              height: 32.
            }}
            src={session.data?.user.image ?? ''}
            alt={session.data?.user.name ?? ''}
          />
        </IconButton>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&::before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={onAuthorPosts}>
          Moje wpisy
        </MenuItem>
        <Divider />
        <MenuItem onClick={onSignOut}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Wyloguj
        </MenuItem>
      </Menu>
    </>
  );
}
