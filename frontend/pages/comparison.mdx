import AlternatingSections from '../components/AlternatingSections'
import {Container, Col, Row, Button, Card} from 'reactstrap'
import ContentHeaderSection from '../components/ContentHeaderSection'
import Layout from '../components/Layout'
import MetaTags from '../components/MetaTags'
import Link from 'next/link'
import ComparisonImg from '../assets/images/comparison.png'
import VeraCryptImg from '../assets/images/veracrypt.png'
import GocryptfsImg from '../assets/images/gocryptfs.png'
import EncfsImg from '../assets/images/encfs.jpg'
import ECryptFsImg from '../assets/images/ecryptfs.png'
import CryFsImg from '../assets/images/teaser_small.jpg'
import { css } from 'aphrodite/no-important'
import { style, ComparisonTable, ComparisonTableHead, ComparisonTableHeader, ComparisonTableBody, ComparisonTableRow, ComparisonTableCell } from '../components/ComparisonPageUtils'

<MetaTags
    title="CryFS: Comparison of encrypted cloud storage solutions"
    url="https://www.cryfs.org/comparison"
    type="article"
    description="Encrypting your Dropbox is easy. Find out about the possible solutions and their pros and cons."
/>

<Layout>
<AlternatingSections start_index={1}>
<ContentHeaderSection title="Encrypt your Dropbox" subtitle="You want to encrypt your Dropbox and don't know which tool to use? Read on.">
</ContentHeaderSection>

<section>
<Container>
<Row>
    <Col md={{size: 8, offset: 2}}>
        <img src={ComparisonImg} style={{marginTop: '5px', marginBottom: '30px', width: '100%'}} alt="Encrypting your Dropbox" />
    </Col>
</Row>
<p style={{color: '#777', fontSize: '14px'}}>
    Disclaimer: This article is written by the developers of CryFS. We (think we) kept it objective and linked to sources for all information presented.
</p>

Having your data in the cloud can be very convenient. However, it can also be a risk.
Data leaks are happening from time to time and you don't want to be the one who gets blackmailed or whose private pictures get public.
You usually also don't want hackers to be able to modify your files and change your yearly earnings report (or whatever else you're storing in the cloud).
Even if you trust the security measures of your cloud provider against hackers, its employees can still access your files
and its computer systems might use your files to create a personality profile to show you targeted advertising.

All these risks can be avoided when you encrypt your files before uploading them.
You could add important files to a zip archive and set a password for example.
However, that is complicated and you would have to zip/unzip the archive each time you want to access your files.

More convenient solutions offer the concept of a virtual filesystem.
That is, you enter your password (which is called <var>mounting</var> the virtual filesystem) and then get a directory
on your computer where you can work with your files as if it was a normal directory.
In reality, the directory is not stored to your harddrive, but all content is encrypted and only the encrypted data is stored and synchronized to the cloud.
All this happens in the background and you don't notice it when working with your files, so it is very convenient.

In the following, we will explain the available tools and explain how they can be used with cloud storage.
If you're just interested in the results, <a href="#summary">scroll down</a>.

</Container>
</section>
<section id="proprietary">
<Container>

## Proprietary Solutions
There are some proprietary solutions on the market, but that means you don't know what the software is doing.
Nobody can check it for vulnerabilities or backdoors.
It might be secure, or it might just as well not be.
The developers might have been approached by government organizations and have been forced to put backdoors into the software.
Or maybe hackers found a way to smuggle bad code into the software and nobody noticed.
In short: It's a bad idea to use proprietary cryptography software.
For open source cryptography software, the source code is open. Everyone can see and check it.
Vulnerabilities can be found and fixed, backdoors can be noticed.
This is why we only describe open source solutions here.

</Container>
</section>
<section id="veracrypt">
<Container>

## TrueCrypt, VeraCrypt

<Row>
<Col md="6">
    <img src={VeraCryptImg} alt="VeraCrypt" className={css(style.image)} />
</Col>
<Col md="6">

[TrueCrypt has been discontinued](http://truecrypt.sourceforge.net/)
some time ago and [has some vulnerabilities](http://www.pcworld.com/article/2987439/encryption/newly-found-truecrypt-flaw-allows-full-system-compromise.html),
so we will focus on its (inofficial) successor [VeraCrypt](https://veracrypt.codeplex.com/) here.

VeraCrypt runs on Windows, Linux and Mac, and is believed to be a secure encryption tool to encrypt your files locally.
It keeps your files confidential, but does not protect the integrity, i.e. a hacker can't read your files, but they could modify them without you noticing.
Like all solutions presented here, it offers you a virtual filesystem and the unencrypted files are never actually stored on your hard disk.
VeraCrypt then stores all filesystem data in one encrypted container file.
If you want to use it to encrypt your Dropbox, you could put the encrypted container file in your Dropbox folder
and it would get automatically synchronized to all devices connected to your Dropbox.
If these devices are also running VeraCrypt, they will (after you entered your password) also offer you a directory where you can work on your files.

</Col>
<Col md="12">

This is very convenient to use and it is secure. However, there is a problem with it.
VeraCrypt is not designed to be used in the cloud and a container file can get very large.
Actually, you have to choose a maximal size for your filesystem in advance and
the container file will have this size, no matter how much of the space you actually use.

Say now you have a large filesystem, i.e. a large container file.
Everything is already uploaded to your cloud. Now you change a small file.
In reality, this means that the large container file changes. Your cloud will notice that and might try to re-upload the whole container file,
which can take a lot of time and will use a lot of internet bandwidth.
Even if you're lucky and your cloud is intelligent enough to notice that only a small part of the container file changed,
you will have a problem when you modify a file on another computer before synchronization finished.
Both computers now made different changes to the container file at the same time.
Because your cloud doesn't know about the VeraCrypt file format, it doesn't have a chance of merging these changes
and will (in the best case) offer you two versions of your container file, i.e. you suddenly end up having two filesystems
and in each there is only one of the changes. Ugly.

So VeraCrypt is a good choice if you are only encrypting your files locally and do not need integrity, but it is not a good idea to use it in a Dropbox.

</Col>
</Row>

</Container>
</section>
<section id="gocryptfs">
<Container>

## gocryptfs

<Row>
<Col md="6">

[Gocryptfs](https://nuetzlich.net/gocryptfs/), like VeraCrypt, offers you a virtual filesystem, so the encryption is happening
in the background and doesn't interfere with your workflows.
It doesn't support Windows (only Linux and Mac), but that might be enough for some users, and there is a third party client for Windows
([cppcryptfs](https://github.com/bailey27/cppcryptfs)).
As opposed to VeraCrypt, it doesn't store your files in one big container file, but encrypts your files individually.
For each of your files, there is an encrypted version in your Dropbox.
This solves the problem we described for VeraCrypt.

</Col>
<Col md="6">
<img src={GocryptfsImg} alt="Gocryptfs" className={css(style.image)} />
</Col>
</Row>

When you change a small file, only that small file has to be re-uploaded and when you modify different files on different
computers at the same time, they modify different encrypted files in the Dropbox and the Dropbox client is able to
handle that.
However, that is also a disadvantage.
Since there is an encrypted file for each of your files, a hacker can exactly see how many files you have, how
large each file is and how they are structured into directories.
This might not be a problem for some applications, but it can be a problem faster than you would think at first.
Say they see that you have a lot of folders with about 20 files each and each file has about 3 megabyte,
then they can say with fair certainty that you are storing a music CD collection there.
Or say you store an illegal copy of a current Windows installation CD (not that we recommend that),
the police could ask your cloud provider to hand over your encrypted files and they could analyze them.
When the number of files, file sizes and directory structure match the CD, they know you're storing it.
The same thing is also an issue for [watermarking attacks](https://en.wikipedia.org/wiki/Watermarking_attack), which we will not explain in detail here.
There are [alternatives](https://www.cryfs.org) to gocryptfs that are not vulnerable to these attacks and also hide your file sizes, metadata and directory structure.

Gocryptfs uses GCM cipher mode. This means it doesn't only protect confidentiality, i.e. against adversaries reading your files,
but also integrity, i.e. against adversaries modifying your files without you noticing it.
The same restriction mentioned for confidentiality also applies for integrity though. It only ensures that the file contents you're reading were at some point written by you.
Attackers can change directory structure, add or delete files or folders, re-add files deleted earlier by you, replace files with earlier versions of themselves
or replace their content with the content of other files, or earlier versions of those other files, and you wouldn't necessarily notice any of that.
The [alternatives](https://www.cryfs.org) mentioned above do also protect against these kinds of attacks.


</Container>
</section>
<section id="encfs">
<Container>

## EncFS

<Row>
<Col md="6">
<img src={EncfsImg} alt="EncFS" className={css(style.image)} />
</Col>
<Col md="6">

[EncFS](https://vgough.github.io/encfs/) was my tool of choice for an encrypted Dropbox for quite some time.
It doesn't support Windows (only Linux and Mac), but there are third party clients for Windows
([encfsmp](http://encfsmp.sourceforge.net/), [encfs4win](http://members.ferrara.linux.it/freddy77/encfs.html)).
The way it works is very similar to gocryptfs and it exists for a much longer time already.
It offers you a virtual filesystem, encryption is in the background, and it encrypts files individually.
Feel free to read the <Link href="#gocryptfs"><a>gocryptfs</a></Link> section above for more information,
the advantages and disadvantages of this approach also apply to EncFS, namely it works well with cloud synchronization,
doesn't interrupt your workflows, but only protects file contents and does not encrypt or prevents attackers from modifying
file sizes and directory structure.

</Col>
</Row>

Also note that the setting whether your client should prevent attackers from modifying
your files is stored with the encrypted data in the cloud by default and an attacker can simply switch it off for you.
So if you want to rely on this feature, make sure you store the config file locally.

A probably even larger issue with EncFS is a [security audit](https://defuse.ca/audits/encfs.htm) from 2014 that
attests EncFS to deviate from established security standards and also found some vulnerabilities in the current EncFS implementation.
The developers say they're working on a 2.0 version of EncFS which should fix most of these issues, but as of today they are not fixed.
Among other vulnerabilities, the security audit found one that is especially a problem with cloud storage.
EncFS is not secure when an attacker gets multiple versions of the same encrypted file at different times.
So if you upload your files to your Dropbox and then modify them, they are not securely encrypted anymore.

So the current version of EncFS can't really be recommended for any application.
EncFS 2.0 might be interesting again when and if it is released.

</Container>
</section>
<section id="ecryptfs">
<Container>

## eCryptfs

<Row>
<Col md="5">

[eCryptfs](http://ecryptfs.org/) is a tool for Linux, mainly known because you're already using it
if you're encrypting your home directory in Ubuntu Linux.
Like EncFS, it doesn't encrypt file sizes or directory structure and therefore has the same problems as described above.
  
Furthermore, eCryptfs is not designed for cloud storage.
It uses heavy caching and assumes that it is the only software accessing the encrypted files.
When it is used for home directory encryption, this assumption is correct and eCryptfs can gain a little bit of performance
with that.
However, when you synchronize your files with Dropbox, the Dropbox client will also modify the encrypted files,
for example when you changed them on another computer.
eCryptfs doesn't support that and could either crash or just overwrite your changes with old versions.

</Col>
<Col md="7">
<img src={ECryptFsImg} alt="eCryptfs" className={css(style.image)} />
</Col>
</Row>

</Container>
</section>
<section id="cryfs">
<Container>

## CryFS

<Row>
<Col md="6">
<img src={CryFsImg} alt="CryFS" className={css(style.image)} />
</Col>
<Col md="5">

Since all of the solutions above have significant disadvantages when used with Dropbox,
we developed [CryFS](https://www.cryfs.org).
Like all other solutions described here, it offers a virtual filesystem and you can work with your files without thinking about the
encryption that is happening in the background.
While it can also be used for local encryption as an alternative to the other tools listed here,
it was built specifically to be used together with Dropbox or other cloud storage providers.
It supports Linux and Mac, and since version 0.10 has experimental Windows support.

</Col>
<Col md="12">

CryFS follows established security standards and is the only tool in this list that works well together with Dropbox
and is secure. As opposed to VeraCrypt, it keeps its data in small encrypted blocks and changing a small file
results in only a small amount of data to be re-uploaded.
As opposed to gocryptfs, EncFS and eCryptfs, it doesn't only encrypt your file contents, but also file sizes, file metadata and
directory structure.
More information on how this is achieved can be found <Link href="/howitworks"><a>here</a></Link>.
The security of CryFS has been proven in a [master's thesis](/cryfs_mathesis.pdf) in 2015.
As far as we know, CryFS is the only solution in this list for which this has been done.

CryFS offers confidentiality and, since version 0.10, also integrity of your data. This means, attackers cannot read your files, file sizes
or directory structure, and also prevents attackers from modifying any of that.
The main drawback of CryFS is that it is relatively new.
The current version is not considered stable yet by the developers and if you decide to use it, regular backups are strongly recommended.
It has gotten quite a bit more stable recently though and is successfully used in a lot of settings already.

The increase in security when compared to other file systems comes at a performance cost.
CryFS is fast enough to be used in practice.
I'm getting a read speed to 170MB/s and a write speed of 80MB/s on my SSD machine, but other file systems are even faster.

</Col>
</Row>

</Container>
</section>
<section id="summary">
<Container>

## Summary
There are many tools available, but most have not been designed to be used in the cloud.

Gocrypfs, EncFS and eCryptfs don't encrypt directory structure. EncFS has severe security vulnerabilities in its current version.
eCryptfs might cause crashes or undefined behavior if there is more than one device connected to your Dropbox.
VeraCrypt works, as long as your container file is small, i.e. you don't mind synchronizing the whole container file on each change, and if you always let it finish synchronization before modifying the files on another computer.
CryFS solves all of these issues, but because of the increased security it is a bit slower.
It is also a very new project and currently only available for Linux and Mac, but has experimental Windows support in the newest version.
So if you don't need Windows support today, you can give it a try.

<ComparisonTable>
    <ComparisonTableHead>
        <ComparisonTableHeader>CryFS</ComparisonTableHeader>
        <ComparisonTableHeader>gocryptfs</ComparisonTableHeader>
        <ComparisonTableHeader>EncFS</ComparisonTableHeader>
        <ComparisonTableHeader>eCryptfs</ComparisonTableHeader>
        <ComparisonTableHeader>VeraCrypt</ComparisonTableHeader>
    </ComparisonTableHead>
    <ComparisonTableBody>
        <ComparisonTableRow title="Easy to use">
            <ComparisonTableCell type="yes" />
            <ComparisonTableCell type="yes" />
            <ComparisonTableCell type="yes" />
            <ComparisonTableCell type="yes" />
            <ComparisonTableCell type="yes" />
        </ComparisonTableRow>
        <ComparisonTableRow title="Performance">
            <ComparisonTableCell type="yes" footnote="a)" />
            <ComparisonTableCell type="yes" />
            <ComparisonTableCell type="yes" />
            <ComparisonTableCell type="yes" />
            <ComparisonTableCell type="yes" />
        </ComparisonTableRow>
        <ComparisonTableRow title="Works together with Dropbox">
            <ComparisonTableCell type="yes" />
            <ComparisonTableCell type="yes" />
            <ComparisonTableCell type="yes" />
            <ComparisonTableCell type="no" />
            <ComparisonTableCell type="half" footnote="b)" />
        </ComparisonTableRow>
        <ComparisonTableRow title="Small changes cause only small amount of data to be re-uploaded">
            <ComparisonTableCell type="yes" />
            <ComparisonTableCell type="yes" />
            <ComparisonTableCell type="yes" />
            <ComparisonTableCell type="yes" />
            <ComparisonTableCell type="no" />
        </ComparisonTableRow>
        <ComparisonTableRow title="No known security flaws">
            <ComparisonTableCell type="yes" />
            <ComparisonTableCell type="yes" />
            <ComparisonTableCell type="no" />
            <ComparisonTableCell type="yes" />
            <ComparisonTableCell type="yes" />
        </ComparisonTableRow>
        <ComparisonTableRow title="Encrypts file contents">
            <ComparisonTableCell type="yes" />
            <ComparisonTableCell type="yes" />
            <ComparisonTableCell type="yes" />
            <ComparisonTableCell type="yes" />
            <ComparisonTableCell type="yes" />
        </ComparisonTableRow>
        <ComparisonTableRow title="Encrypts file metadata and file sizes">
            <ComparisonTableCell type="yes" />
            <ComparisonTableCell type="no" />
            <ComparisonTableCell type="no" />
            <ComparisonTableCell type="no" />
            <ComparisonTableCell type="yes" />
        </ComparisonTableRow>
        <ComparisonTableRow title="Encrypts directory structure">
            <ComparisonTableCell type="yes" />
            <ComparisonTableCell type="no" />
            <ComparisonTableCell type="no" />
            <ComparisonTableCell type="no" />
            <ComparisonTableCell type="yes" />
        </ComparisonTableRow>
        <ComparisonTableRow title="Protects file contents from malicious modifications">
            <ComparisonTableCell type="yes" footnote="c)" />
            <ComparisonTableCell type="half" footnote="d)" />
            <ComparisonTableCell type="half" footnote="e)" />
            <ComparisonTableCell type="no" />
            <ComparisonTableCell type="no" />
        </ComparisonTableRow>
        <ComparisonTableRow title="Protects file metadata and file sizes from malicious modifications">
            <ComparisonTableCell type="yes" />
            <ComparisonTableCell type="no" />
            <ComparisonTableCell type="no" />
            <ComparisonTableCell type="no" />
            <ComparisonTableCell type="no" />
        </ComparisonTableRow>
        <ComparisonTableRow title="Protects directory structure from malicious modifications">
            <ComparisonTableCell type="yes" />
            <ComparisonTableCell type="no" />
            <ComparisonTableCell type="no" />
            <ComparisonTableCell type="no" />
            <ComparisonTableCell type="no" />
        </ComparisonTableRow>
        <ComparisonTableRow title="Available for Linux">
            <ComparisonTableCell type="yes" />
            <ComparisonTableCell type="yes" />
            <ComparisonTableCell type="yes" />
            <ComparisonTableCell type="yes" />
            <ComparisonTableCell type="yes" />
        </ComparisonTableRow>
        <ComparisonTableRow title="Available for Mac OS X">
            <ComparisonTableCell type="yes" />
            <ComparisonTableCell type="yes" />
            <ComparisonTableCell type="yes" />
            <ComparisonTableCell type="no" />
            <ComparisonTableCell type="yes" />
        </ComparisonTableRow>
        <ComparisonTableRow title="Available for Windows">
            <ComparisonTableCell type="half" footnote="f)" />
            <ComparisonTableCell type="half" footnote="g)" />
            <ComparisonTableCell type="half" footnote="g)" />
            <ComparisonTableCell type="no" />
            <ComparisonTableCell type="yes" />
        </ComparisonTableRow>
    </ComparisonTableBody>
</ComparisonTable>

<strong>Footnotes:</strong>
<ol className={css(style.footnotes)}>
    <li className={css(style.footnotesLi)}>CryFS is fast enough to be used in practice, but some of the other file systems in the list are faster.</li>
    <li className={css(style.footnotesLi)}>VeraCrypt causes unresolvable conflicts when modifying the filesystem on two machines without full synchronization inbetween.</li>
    <li className={css(style.footnotesLi)}>CryFS supports this starting with version 0.10.</li>
    <li className={css(style.footnotesLi)}>Gocryptfs only makes sure that the data you're reading was at some point written by you. It does not protect against attackers who replace the content of a file with the content of a different file, or with an earlier version of the same or a different file.</li>
    <li className={css(style.footnotesLi)}>Like in (d), EncFS also only makes sure that the data you're reading was at some point written by you. Furthermore, the current implementation is flawed because a hacker can simply disable the integrity check.</li>
    <li className={css(style.footnotesLi)}>There is experimental Windows support starting with CryFS version 0.10.</li>
    <li className={css(style.footnotesLi)}>There is a third-party experimental version of gocryptfs and EncFS for Windows.</li>
</ol>

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
                    <Link href="/tutorial"><Button color="primary" size="lg">CryFS Tutorial</Button></Link>
                </div>
            </Card>
        </Col>
    </Row>
</Container>
</section>

</AlternatingSections>
</Layout>

<script type="text/javascript" src="//s7.addthis.com/js/300/addthis_widget.js#pubid=ra-56b4f9ebfcc506d2" async="async" />
