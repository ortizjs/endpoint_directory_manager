import '../App.css';
import React, {useState, useEffect, useRef} from 'react';
import DirectoryHierarchyList from './DirectoryHierarchyList';

const DirectoryManager = () => {
    const [directories, setDirectories] = useState([]);
    const [command, setCommand] = useState('');
    const [showDirectoryList, setShowDirectoryList] = useState(true);
    // const isMounted = useRef(false);
    const [message, setMessage] = useState('');
    
    const sampleInput = [
        'CREATE vegetables',
        'CREATE grains',
        'CREATE fruits/apples',
        'CREATE fruits/apples/fuji',
        'LIST',
        'CREATE grains/squash',
        'MOVE grains/squash vegetables',
        'CREATE foods',
        'MOVE grains foods',
        'MOVE fruits foods',
        'MOVE vegetables foods',
        'LIST',
        'DELETE fruits/apples',
        'DELETE foods/fruits/apples',
        'LIST'
    ]

    const handleInputChange = (event) => {
        setCommand(event.target.value);
    };

    const handleCreateDirectory = (directoryPath) => {
        const directoryNames = directoryPath.split('/');
        let currentDirectories = directories;
    
        directoryNames.forEach((directoryName) => {
          const existingDirectory = currentDirectories.find((dir) => dir.name === directoryName);
    
          if (!existingDirectory) {
            const newDirectory = {
              name: directoryName,
              subDirectories: [],
            };
    
            currentDirectories.push(newDirectory);
            currentDirectories = newDirectory.subDirectories;
          } else {
            currentDirectories = existingDirectory.subDirectories;
          }
        });
    
        setDirectories([...directories]);
        setShowDirectoryList(false);
    };

 
    const handleDeleteParentDirectory = (name) => {
        const updatedDirectories = directories.filter((directory) => {
          if (directory.name === name) {
            return false;
          }
          return true;
        });
      
        setDirectories([...updatedDirectories]);
        setShowDirectoryList(false);
      };
      

    const handleDeleteDirectory = (directoryPath) => {
        const directory = findDirectory(directoryPath);
        
        if (directory) {
          const parentDirectory = findParentDirectory(directoryPath);
    
          if (parentDirectory) {
            parentDirectory.subDirectories = parentDirectory.subDirectories.filter(
              (dir) => dir.name !== directory.name
            );
            setDirectories([...directories]);
          } else {
            handleDeleteParentDirectory(directoryPath);
          }
        } else {
            let pathSplit = directoryPath.split('/');
           setMessage(`Cannot delete ${directoryPath} - ${pathSplit[0]} does not exist`);
        }
        setShowDirectoryList(false)
    };

    const findDirectory = (path, currentDirectories = directories) => {
        const pathParts = path.split('/');
        let currentDirectory = null;
    
        for (let i = 0; i < pathParts.length; i++) {
          const directoryName = pathParts[i];
          currentDirectory = currentDirectories.find((dir) => dir.name === directoryName);
    
          if (!currentDirectory) {
            return null;
          }
    
          currentDirectories = currentDirectory.subDirectories;
        }
    
        return currentDirectory;
    };
    
    const findParentDirectory = (path) => {
        const parentPath = path.split('/').slice(0, -1).join('/');
        return findDirectory(parentPath);
    };
    

    const handleMoveDirectory = (sourcePath, destinationPath, automated) => {
        const sourceDirectory = findDirectory(sourcePath);
        const destinationDirectory = findDirectory(destinationPath);
        const sourceParentDirectory = findParentDirectory(sourcePath);

        
        if (sourceDirectory && destinationDirectory) {    
          if (sourceParentDirectory) {
            sourceParentDirectory.subDirectories = sourceParentDirectory.subDirectories.filter(
              (dir) => dir.name !== sourceDirectory.name
            );
          } 
       
          destinationDirectory.subDirectories.push(sourceDirectory);
          setDirectories([...directories]);
        }
        if (!sourceParentDirectory) {
            handleDeleteDirectory(sourceDirectory.name);
        }
        if (automated) {
            handleDeleteParentDirectory(sourceDirectory.name)
        }
        setShowDirectoryList(false);
    };

    const handleListDirectories = () => {
        setShowDirectoryList(true);
    }

    const handleDefaultMethod = () => {
        setMessage("Invalid command");
    }

    const handleCommand = (command, automated=false) => {
        
        const commandParts = command.split(' ');
        const commandAction = commandParts[0].toUpperCase();
        const [source, destination] = [commandParts[1], commandParts[2]];

        if (automated) {
            setMessage(command);
        }
       
        switch (commandAction) {
          case 'CREATE':
            handleCreateDirectory(source);
            break;
          case 'MOVE':
            handleMoveDirectory(source, destination, automated);
            break;
          case 'DELETE':
            setMessage('');
            handleDeleteDirectory(source);
            break;
          case 'LIST':
            handleListDirectories()
            break;
          default:
            handleDefaultMethod();
            break;

        }
        setCommand('');
    };

    const handleRunDirectoryUpdate = (event) => {
        event.preventDefault();
        if (command !== '') {
            setMessage(command);
            handleCommand(command);
            setCommand('');
        }
    };

    const handleSampleInput = (event) => {
        event.preventDefault()
        let index = 0;
        const interval = setInterval(() => {
          const command = sampleInput[index];
          handleCommand(command, true);
          index++;
    
          if (index >= sampleInput.length) {
            let repeatedDirs = ['grains', 'fruits', 'vegetables'];
            let cleanedDirectories = directories.filter((dir) => repeatedDirs.indexOf(dir.name) === -1);
            setDirectories([...cleanedDirectories])
            clearInterval(interval);
          }
        }, 1000);

    };

    const onHitEnter = (event) => {
        var code = event.key;
        if (code === 'Enter') {
            handleRunDirectoryUpdate(event)
        }
    }

    // useEffect(() => {
    //     if (!isMounted.current) {
    //         isMounted.current = true;
    //         handleSampleInput();
    //     }
    // }, []);
    
      
    return (
        <div className='manager-container'>
            <h1 className='title'>Endpoint Directory Manager</h1>
            <div className='new-directory-input-container' >
                <input
                    type="text" 
                    placeholder="Please enter a command" 
                    value={command} 
                    onChange={handleInputChange}
                    onKeyPress={onHitEnter}
                />
            </div>
            <div className='buttons-container'>
                <button className="run-buttons" onClick={handleRunDirectoryUpdate}>Run Directory Update</button>
                <button className="run-buttons" onClick={handleSampleInput}>Run Sample Input</button>
            </div>
            <div className='hierarchy-conainter'>
                <h2>Directory Hierarchy</h2>
                {showDirectoryList ? 
                <DirectoryHierarchyList
                    directories={directories}
                /> : <>
                    <h4>{message}</h4>
                </>}
            </div>
        </div>
    )
}

export default DirectoryManager;    