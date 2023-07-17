audience: users
level: minor
reference: issue 5995
---
Generic Worker: Adds `task.payload.feature.loopbackAudio` for loopback audio device support on Linux.

The `snd-aloop` kernel module must be installed on the host system for this feature to work, although it does not _need_ to be loaded. Generic Worker loads the module with `modprobe` and generates the virtual audio device with a `snd-aloop` command. Under the multiuser engine, it also manages file ownership of the device with `chown` to ensure that only tasks with suitable scopes have read/write access to the virtual device.

For tasks that enable the feature, the virtual audio device locations will be provided to the task commands via the environment variables `TASKCLUSTER_AUDIO_DEVICE_NUMBER` with N in [0, 4], inclusive. The values of the environment variables depend on deployment configuration, and therefore tasks should not assume a fixed value. Its value will however take the form /dev/snd/controlC<DEVICE_NUMBER>, /dev/snd/pcmC<DEVICE_NUMBER>D0c, /dev/snd/pcmC<DEVICE_NUMBER>D0p, /dev/snd/pcmC<DEVICE_NUMBER>D1c, /dev/snd/pcmC<DEVICE_NUMBER>D1p, respectively where <DEVICE_NUMBER> is an integer between 0 and 31. The Generic Worker config setting `loopbackAudioDeviceNumber` may be used to change the device number. Future releases of Generic Worker may provide the capability of having more than one virtual audio device; currently only one virtual audio device is supported.
