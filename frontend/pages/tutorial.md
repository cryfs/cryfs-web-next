import AlternatingSections from '../components/AlternatingSections'
import {Container, Alert, Col, Row, Button, Card} from 'reactstrap'
import ContentHeaderSection from '../components/ContentHeaderSection'
import Layout from '../components/Layout'
import MetaTags from '../components/MetaTags'
import Link from 'next/link'
import {Console, ConsoleCommand, ConsoleOutput} from '../components/Console'

<MetaTags
    title="CryFS: Tutorial"
    url="https://www.cryfs.org/tutorial"
    type="article"
    description="A quick and easy introduction into the basic usage of CryFS. CryFS encrypts your Dropbox and protects you against hackers and data leaks. It also works well together with other cloud providers."
/>

<Layout>
<AlternatingSections start_index={1}>
<ContentHeaderSection title="Tutorial" subtitle="CryFS is very easy to use. Let us show you how." />

<section>
<Container>

## Install CryFS
See <Link href="/#download"><a>Download Instructions</a></Link>.

</Container>
</section>

<section>
<Container>

## Setup an encrypted directory
Once installed, you can create an encrypted directory by calling <kbd>cryfs basedir mountdir</kbd>.
You can call the directories however you like, we chose <var>basedir</var> and <var>mountdir</var> for demonstration purposes.
If the corresponding directories don't exist yet, CryFS will offer to create them for you.

<Console>
    <ConsoleCommand>cryfs basedir mountdir</ConsoleCommand>
</Console>

This will ask you some questions about the configuration of your encrypted directory.
For now, we just say yes when we're asked whether to use the default settings.
CryFS will also ask you for a password and then you're good to go.
 
You can modify files and directories in the <var>mountdir</var> directory.
CryFS will then encrypt them and store the encrypted data in the <var>basedir</var> directory.
The <var>mountdir</var> directory is a virtual directory, meaning it doesn't actually exist on your harddisk,
but is provided by CryFS.
Whenever you access files or directories in it, CryFS handles the decryption in the background, so that you can work with <var>mountdir</var> as if it was a real directory.
This way, even if someone steals your harddisk, your data is still secure, since they can't decrypt it.

</Container>
</section>
<section>
<Container>

## Using the encrypted directory
You can work in <var>mountdir</var>, add files to it, modify them, add subdirectories, and do whatever you want with it.
Everything you store inside will be encrypted and stored in <var>basedir</var>.
The unencrypted content of <var>mountdir</var> will never be stored to the harddisk, so everything on your harddisk is encrypted.
CryFS uses an encryption scheme that doesn't only encrypt file contents, but also the file sizes, file metadata and directory structure is encrypted.
Let's take a look.

First, we create a file and a directory in <var>mountdir</var>.
<Console>
    <ConsoleCommand>cd mountdir</ConsoleCommand>
    <ConsoleCommand>echo "My file content" &gt; myfile</ConsoleCommand>
    <ConsoleCommand>mkdir mydirectory</ConsoleCommand>
</Console>

Now we check that the file and the directory exist and that the file has the content we just added to it.
<Console>
    <ConsoleCommand>ls</ConsoleCommand>
    <ConsoleOutput>mydirectory myfile</ConsoleOutput>
    <ConsoleCommand>cat myfile</ConsoleCommand>
    <ConsoleOutput>My file content</ConsoleOutput>
</Console>

If we look into the <var>basedir</var>, we see some cryptic files that contain the encrypted data of the <var>mountdir</var> directory.
<Console>
    <ConsoleCommand>ls ../basedir</ConsoleCommand>
    <ConsoleOutput>[some encrypted files]</ConsoleOutput>
</Console>

Let's go back and unmount the encrypted directory.
<Console>
    <ConsoleCommand>cd ..</ConsoleCommand>
    <ConsoleCommand>cryfs-unmount mountdir</ConsoleCommand>
</Console>

<Alert color="info">

**Note**: On CryFS versions 0.9.x, use this command instead:
<Console>
    <ConsoleCommand>cd ..</ConsoleCommand>
    <ConsoleCommand>fusermount -u mountdir</ConsoleCommand>
</Console>

</Alert>

Now, CryFS isn't running anymore, which means we cannot access our data anymore. The <var>mountdir</var> is empty.
<Console>
    <ConsoleCommand>ls mountdir</ConsoleCommand>
    <ConsoleOutput>[no output because directory empty]</ConsoleOutput>
</Console>

But don't worry, if we look at the <var>basedir</var>, everything is still there, it is only encrypted.
<Console>
    <ConsoleCommand>ls basedir</ConsoleCommand>
    <ConsoleOutput>[some encrypted files]</ConsoleOutput>
</Console>

When we start CryFS again, we can access our files again.
<Console>
    <ConsoleCommand>cryfs basedir mountdir</ConsoleCommand>
    <ConsoleCommand>ls mountdir</ConsoleCommand>
    <ConsoleOutput>mydirectory myfile</ConsoleOutput>
    <ConsoleCommand>cat mountdir/myfile</ConsoleCommand>
    <ConsoleOutput>My file content</ConsoleOutput>
</Console>

</Container>
</section>
<section>
<Container>

## Using CryFS together with Dropbox
Although CryFS can also be used to just encrypt files locally, for example to protect against harddrive theft,
its main purpose is to be used together with cloud storage providers like Dropbox.
It should work well together with any cloud storage provider that uses a local synchronization folder.

First, setup the Dropbox client to synchronize your cloud files to a local folder.
In this tutorial, we'll assume that folder is called <var>dropbox</var>.

Then, we start CryFS.
Since we only want to upload the encrypted files, we have to put the <var>basedir</var> into the <var>dropbox</var> folder,
so Dropbox will synchronize it.
If <var>basedir</var> or <var>mountdir</var> don't exist yet, CryFS will ask us whether it should create them.
We answer to that question with yes.
<Console>
    <ConsoleCommand>cryfs dropbox/basedir mountdir</ConsoleCommand>
</Console>
<Alert color="warning">
<b>Warning!</b>&nbsp;
Take care that you don't put the <var>mountdir</var> into the <var>dropbox</var> folder,
because otherwise Dropbox would also upload the unencrypted files from <var>mountdir</var>.
</Alert>

Now, everything we write to <var>mountdir</var> will be automatically encrypted,
the encrypted data will be written to <var>dropbox/basedir</var>, where the Dropbox client will pick it up
and upload it to the cloud.

As before, let's add a file to it.
<Console>
    <ConsoleCommand>echo "My file content" &gt; mountdir/myfile</ConsoleCommand>
</Console>

To check that synchronization works, we can add a second client on another computer.
Install CryFS and the Dropbox client and set Dropbox up to synchronize to a local folder.
We'll assume you called it <var>dropbox</var> again.

If it is set up correctly, there should be a folder <var>dropbox/basedir</var>.
You might have to wait some seconds for Dropbox to finish synchronization.
<Console>
    <ConsoleCommand>ls dropbox</ConsoleCommand>
    <ConsoleOutput>[output contains basedir]</ConsoleOutput>
</Console>

<Alert color="warning">
<b>Warning!</b>&nbsp;
Never access the file system from two devices at the same time. This can corrupt your file system.
When switching devices, always make sure to stop CryFS on the first device, let Dropbox finish
synchronization, and then start CryFS on the second device. There are some ideas on how future versions
of CryFS could allow for concurrent access, but in the current version this is not safe.
</Alert>

Then, we start CryFS.
<Console>
    <ConsoleCommand>cryfs dropbox/basedir mountdir</ConsoleCommand>
</Console>

Since <var>mountdir</var> doesn't exist yet on the second client, CryFS will ask whether it should create it.
We answer to that question with yes.

If we now look into <var>mountdir</var> on the second client, we see the file we created on the first computer.
<Console>
    <ConsoleCommand>ls mountdir</ConsoleCommand>
    <ConsoleOutput>myfile</ConsoleOutput>
    <ConsoleCommand>cat mountdir/myfile</ConsoleCommand>
    <ConsoleOutput>My file content</ConsoleOutput>
</Console>

You can play around with your setup now. As long as CryFS and Dropbox are running on both computers,
everything you modify in one of the <var>mountdir</var> directories will automatically be synchronized to
the <var>mountdir</var> on the other computer, while Dropbox only sees the encrypted data.

</Container>
</section>
<section>
<Container>
    <Row>
        <Col style={{marginTop: '20px'}} md={{size: 8, offset: 2}}>
            <Card body style={{ backgroundColor: '#f5f5f5', borderColor: '#e3e3e3' }}>
                <div className="text-center">
                    <p className="lead">
                        Try it out and
                    </p>
                    <Link href="/#download"><Button color="primary" size="lg">Download CryFS</Button></Link>
                </div>
            </Card>
        </Col>
    </Row>
</Container>
</section>

</AlternatingSections>
</Layout>
