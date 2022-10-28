import chokidar from 'chokidar';
const log = console.log;
export const monitor = (path, onAdd, onChange) => {
    const watcher = chokidar.watch(path, {
        ignored: '.DS_Store'
    });
    watcher
        .on('ready', () => {
        log('Initial scan complete. Ready for changes');
        watcher
            .on('add', path => {
            log(`File ${path} has been added`);
            onAdd(path);
        })
            .on('change', path => {
            log(`File ${path} has been changed`);
            onChange(path);
        });
        // .on('raw', (eventName, path, details: any) => {
        //   console.log(eventName, path, details)
        //   // del moved --> flag: 67584
        // })
    });
};
