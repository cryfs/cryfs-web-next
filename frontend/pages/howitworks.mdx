import AlternatingSections from '../components/AlternatingSections'
import {Container, Col, Row, Button, Card} from 'reactstrap'
import ContentHeaderSection from '../components/ContentHeaderSection'
import Layout from '../components/Layout'
import MetaTags from '../components/MetaTags'
import Link from 'next/link'
import StoringDataImg from '../assets/images/storingdata.png'
import ConfigfileEncryptionImg from '../assets/images/configfileencryption.png'

<MetaTags
    title="CryFS: How it works"
    url="https://www.cryfs.org/howitworks"
    type="article"
    description="A description of the CryFS internals. CryFS encrypts your Dropbox and protects you against hackers and data leaks. It also works well together with other cloud providers."
/>

<Layout>
<AlternatingSections start_index={1}>
<ContentHeaderSection title="How it works" subtitle="We explain how CryFS works and why it is secure.">
  The description can be a bit technical in some points. If you're rather interested in using CryFS, take a look at the <Link href="/tutorial"><a>CryFS Tutorial</a></Link>.
</ContentHeaderSection>

<section>
<Container>

## Storing data
<Row>
<Col md="4">
<img src={StoringDataImg} alt="Your files, metadata and directory structure are stored as a set of same-size blocks, encrypted, and stored in the cloud." style={{maxWidth: "100%"}} />
</Col>
<Col md="8">

The goal of CryFS is not only to keep file contents, but also file sizes, metadata and directory structure confidential.

To hide file sizes, CryFS splits the content of a file into same-size blocks and encrypts these blocks individually.
A tree structure is used to remember how the blocks belong together to form a file.
This tree structure has very little overhead and itself is also stored using encrypted same-size blocks.
To hide file metadata and directory structure, they are also represented using encrypted same-size blocks.

Each encrypted block is stored as a file in the base directory, using a random ID as filename.
The base directory can then be set up to be synchronized with a cloud provider like Dropbox.
An attacker with access to the base directory can only see a set of same-size ciphertext blocks and can't see
contents, file sizes, metadata or directory structure of your data.

The blocks are encrypted using a block cipher chosen by the user. A random encryption key is generated when the filesystem is created.
This key is stored in a configuration file, which is then encrypted using the password chosen by the user.
Since it is encrypted, it can be stored together with the ciphertext blocks in the cloud, which is the default.
If you want to use an insecure (e.g. empty) password or don't trust the scrypt algorithm used for encrypting the configuration file, you can also keep the configuration file locally.

</Col>
</Row>
</Container>
</section>

<section>
<Container>

## Configuration File
The base directory also contains a configuration file with the information CryFS needs to decrypt it.
This configuration file is encrypted and integrity-checked using the password chosen by the user, so an attacker cannot read or modify it.

The information stored in the configuration file includes the following.
- <strong>&#91;Cipher&#93;</strong>: The cipher used (e.g. <var>aes-256-gcm</var>)
- <strong>&#91;Encryption Key&#93;</strong>: The encryption key used for encrypting blocks
- <strong>&#91;Root Block ID&#93;</strong>: The block ID for the block storing the root directory (entry point for the filesystem)

<Row>
<Col md="8">

The configuration file is encrypted twice, once with <var>aes-256-gcm</var> and once with the cipher chosen by the user.
This way, if the user doesn't trust <var>aes-256-gcm</var> for some reason,
they can choose another cipher and still be secure.
The keys for both encryption layers are generated from the user-chosen password using [scrypt](https://en.wikipedia.org/wiki/Scrypt).

In detail, CryFS generates two keys <var>outer_key</var> and <var>inner_key</var> using scrypt and the user password.
It encrypts the configuration file using the user cipher and <var>inner_key</var>.
To the ciphertext, it prepends the name of the user cipher (so it knows how to decrypt it later) and encrypts
the result using <var>aes-256-gcm</var> and <var>outer_key</var>. This way, an attacker cannot see or manipulate which cipher is used.
As a last step, the scrypt configuration parameters are prepended, so CryFS knows how to configure scrypt when
decrypting the filesystem.
When decrypting the configuration file, CryFS first reads the scrypt parameters and regenerates both keys from the user password.
Then, it decrypts the first layer and reads the cipher chosen by the user.
Using this cipher, it decrypts the second layer and reads the configuration values.
</Col>
<Col md="4" style={{marginTop: '20px'}}>
<img src={ConfigfileEncryptionImg} alt="Configuration File Encryption Layers" style={{maxWidth: "100%"}} />
</Col>
</Row>

The integrity of the configuration file depends on <var>aes-256-gcm</var>.
This cipher is a standard cipher and believed to be very secure.
If, however, you don't trust the integrity of <var>aes-256-gcm</var> and want to use another cipher instead,
we recommend adding the <kbd>--cipher xxx</kbd> parameter each time you mount the filesystem.
This way, CryFS can check that the cipher used by the filesystem is the one you actually specified
and you don't have to rely on the <var>aes-256-gcm</var> integrity verification step.

Alternatively, you can store the configuration file outside of the base directory and not upload it into the cloud.<br />
This is possible using the <kbd>--config</kbd> parameter when calling CryFS.
      
</Container>
</section>
<section>
<Container>

## Security Analysis
The security of CryFS has been proven in a [master's thesis](/cryfs_mathesis.pdf)
and in a [scientific paper published at DBSec 2017](http://dx.doi.org/10.1007/978-3-319-61176-1_23)
([PDF](https://eprint.iacr.org/2017/773.pdf)) using a game-based security approach.
The works also contain a detailed description of the inner workings of CryFS.

The current version meets all security goals regarding confidentiality of file contents, size, metadata and directory structure.
The integrity goals mentioned in the thesis are also implemented as of version 0.10.0.
The 0.9.x versions protect the encrypted blocks from being modified by an attacker,
since they use an authenticated encryption scheme like <var>aes-256-gcm</var>,
but they don't prevent an attacker from rolling back the filesystem by replacing blocks with an earlier valid version of the same block yet.

</Container>
</section>

<section>
<Container>
    <Row>
        <Col style={{marginTop: '20px'}} md={{size: 8, offset: 2}}>
            <Card body style={{ backgroundColor: '#f5f5f5', borderColor: '#e3e3e3' }}>
                <div className="text-center">
                    <p className="lead">
                        Get started with the
                    </p>
                    <Link href="/tutorial"><Button color="primary" size="lg">Tutorial</Button></Link>
                </div>
            </Card>
        </Col>
    </Row>
</Container>
</section>

</AlternatingSections>
</Layout>
